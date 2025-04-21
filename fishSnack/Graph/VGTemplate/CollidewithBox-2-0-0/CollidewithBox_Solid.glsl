
vec3 halfSize = (Size.xyz + size.xyz * scale.xyz) / 2.0;
const float Deg2Rad = VFX_M_PI_F / 180.0;
vec3 radOrient = Orientation.xyz * vec3(Deg2Rad);
mat4 modelMat = GetModelMatrix(-radOrient, Position.xyz, 1.0);
vec3 mPos = (modelMat * vec4(position, 1.0)).xyz;
vec3 nextPos = position + velocity * deltaTime;
vec3 mNextPos = (modelMat * vec4(nextPos, 1.0)).xyz;
float sd1 = sdBox(mPos, halfSize);
float sd2 = sdBox(mNextPos, halfSize);

vec3 abs_vel = abs(velocity);
float SD_GAP = min(deltaTime * abs_vel.x, min(deltaTime * abs_vel.y, deltaTime * abs_vel.z));
const float BOUNCE_BACK_SCALE = 1.5;
if (sd1 <= 0.0) {
    collisionFlag |= 1u << collisionFlagPos;
    vec3 newPos = mPos, gap = abs(halfSize - abs(mPos));
    mat4 invModelMat = GetModelMatrix(radOrient, -Position.xyz, -1.0);

    newPos.x = gap.x < gap.y && gap.x < gap.z ? mPos.x + sign(mPos.x) * gap.x * BOUNCE_BACK_SCALE : mPos.x;
    newPos.y = gap.y < gap.x && gap.y < gap.z ? mPos.y + sign(mPos.y) * gap.y * BOUNCE_BACK_SCALE : mPos.y;
    newPos.z = gap.z < gap.x && gap.z < gap.y ? mPos.z + sign(mPos.z) * gap.z * BOUNCE_BACK_SCALE : mPos.z;

    position = (invModelMat * vec4(newPos, 1.0)).xyz;
        
    mat4 rotateMat = GetModelMatrix(radOrient, vec3(0.0, 0.0, 0.0), 1.0);
    vec3 plane_norm = (rotateMat * vec4(1.0, 0.0, 0.0, 0.0)).xyz;
    plane_norm = gap.y < gap.x && gap.y < gap.z ? (rotateMat * vec4(0.0, 1.0, 0.0, 0.0)).xyz : plane_norm;
    plane_norm = gap.z < gap.x && gap.z < gap.y ? (rotateMat * vec4(0.0, 0.0, 1.0, 0.0)).xyz : plane_norm;
    vec3 velPlane, velVtc, newVel;
    vec3 outerVec = position - Position.xyz;
    plane_norm = dot(plane_norm, outerVec) > 0.0 ? plane_norm : -plane_norm;
    float cosNormVel = dot(plane_norm, velocity) / length(velocity) / length(plane_norm);
    velVtc = VFXSafeNormalize(plane_norm) * length(velocity) * cosNormVel;
    velVtc = dot(velVtc, plane_norm) > 0.0 ? -velVtc : velVtc;
    vec3 strikeVel = dot(velocity, plane_norm) > 0.0 ? -velocity : velocity;
    velPlane = strikeVel - velVtc;
    newVel = -velVtc * Bounce + velPlane * clamp(1.0 - Friction, 0.0, 1.0);
    velocity = mix(velocity, newVel, step(sd2, sd1));
    age += lifetime * LifeLoss;
}