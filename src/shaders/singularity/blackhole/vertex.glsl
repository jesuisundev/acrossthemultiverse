uniform float uTime;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vEyeVector;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // clip space coordinates of the camera related vertices
    vec4 viewPosition = viewMatrix * modelPosition;

    // clip space coordinates of the final projetction render
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    vUv = uv;
}