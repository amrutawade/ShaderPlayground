
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    vUv = uv;

    vec4 modelPosition = modelViewMatrix * vec4(position, 1.0);

    vNormal = normalize(normalMatrix * normal);
    vPosition = modelPosition.xyz;

    gl_Position = projectionMatrix * modelPosition;
}
