uniform sampler2D globeTexture;

varying vec2 vertexUV;
varying vec3 vertexNormal;

void main() {
    // the following two lines for blue atmosphere
    float intensity = 1.05 - dot(vertexNormal, vec3(0.0, 0.0, 1.0));
    vec3 atmosphere = vec3(0.3, 0.6, 1.0) * pow(intensity, 1.5);

    gl_FragColor = vec4(atmosphere + texture2D(globeTexture, vertexUV).xyz, 1.0);
}

// the following code will implement the 2d texture on 3d sphere 
// uniform sampler2D globeTexture;

// varying vec2 vertexUV;

// void main() {
//     gl_FragColor = vec4(texture2D(globeTexture, vertexUV).xyz, 1.0);
// }