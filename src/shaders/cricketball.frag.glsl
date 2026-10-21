precision highp float;

uniform float uTime;
uniform float uRoughness;
uniform float uSeamWidth;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

float hash(vec2 p) {
    return fract(
        sin(dot(p, vec2(127.1, 311.7))) * 43758.5453
    );
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    f = f * f * (3.0 - 2.0 * f);

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    return mix(
        mix(a, b, f.x),
        mix(c, d, f.x),
        f.y
    );
}

void main() {
    vec2 uv = vUv;

    // Fine leather grain.
    float grain = noise(uv * vec2(260.0, 520.0));
    float fineGrain = hash(uv * vec2(900.0, 1800.0));

    vec3 leatherDark = vec3(0.22, 0.008, 0.015);
    vec3 leatherRed  = vec3(0.65, 0.025, 0.035);
    vec3 leatherLight = vec3(0.88, 0.10, 0.09);

    float variation = grain * 0.45 + fineGrain * 0.08;
    vec3 color = mix(leatherDark, leatherRed, variation + 0.35);

    color = mix(
        color,
        leatherLight,
        smoothstep(0.60, 0.95, grain) * 0.28
    );

    // Curved seam path across the spherical UV surface.
    float curve =
        0.50 + 0.085 * sin((uv.x - 0.5) * 6.2831853);

    float seamDistance = abs(uv.y - curve);

    // Dark groove underneath the stitching.
    float groove = 1.0 - smoothstep(
        uSeamWidth,
        uSeamWidth + 0.012,
        seamDistance
    );

    color = mix(color, vec3(0.12, 0.008, 0.012), groove * 0.85);

    // Pale raised seam.
    float seam = 1.0 - smoothstep(
        uSeamWidth * 0.48,
        uSeamWidth * 0.80,
        seamDistance
    );

    color = mix(color, vec3(0.94, 0.82, 0.67), seam * 0.95);

    // Small stitches distributed along the seam.
    float stitchPosition = fract(uv.x * 95.0);
    float stitchLength = step(0.28, stitchPosition)
                       * (1.0 - step(0.72, stitchPosition));

    float stitchDistance = abs(seamDistance - uSeamWidth * 1.5);

    float stitch = stitchLength
                 * (1.0 - smoothstep(0.002, 0.006, stitchDistance));

    color = mix(color, vec3(1.0, 0.88, 0.73), stitch * 0.95);

    // View-space lighting.
    vec3 normal = normalize(vNormal);
    vec3 lightDir = normalize(vec3(-0.45, 0.65, 0.9));
    vec3 viewDir = normalize(-vPosition);

    float diffuse = max(dot(normal, lightDir), 0.0);

    vec3 halfDir = normalize(lightDir + viewDir);
    float specular = pow(
        max(dot(normal, halfDir), 0.0),
        mix(90.0, 12.0, uRoughness)
    );

    float lighting = 0.28 + diffuse * 0.85;

    color *= lighting;
    color += vec3(1.0, 0.58, 0.42) * specular
           * (1.0 - uRoughness) * 0.45;

    gl_FragColor = vec4(color, 1.0);
}