import _controls from 'orbit-controls';
const controls = _controls({
  position: [0, 0, 10]
});

const renderer = new NEXT.Renderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.canvas);

NEXT.Shader.collection = NEXT.shaders;

const scene = new NEXT.Scene();

const dirLight = new NEXT.DirectionalLight();
dirLight.intensity = 3;
dirLight.position.set(0, 10, 0);
dirLight.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
scene.add(dirLight);

const camera = new NEXT.Camera({
  type: 'perspective',
  fovy: Math.PI / 3,
  aspect: window.innerWidth / window.innerHeight
});

camera.position.set(0, 0, 10);

const camera2 = new NEXT.Camera({
  type: 'perspective',
  fovy: Math.PI / 3,
  aspect: window.innerWidth / window.innerHeight
});

const orthoCamera = new NEXT.Camera.ortho(1, 1);

// img.onload = () => {
const material = new NEXT.LambertMaterial({
  map: new NEXT.Texture.fromUrl('./assets/texture.png')
});

const material2 = new NEXT.LambertMaterial({
  color: [1, 0, 0]
});

// setTimeout(() => {
//   material.uniforms.map = new NEXT.Texture.fromUrl('./assets/texture2.jpg');
//   // material.uniforms.map.then(v => {
//   //   v.isTest = true;
//   // });
// }, 1000);

const sphere1 = new NEXT.Sphere({
  radius: 2,
  shader: material
});

sphere1.position.set(0, 0, 0);

// vec3.set(sphere1.position, 0, 0, 0);
scene.add(sphere1);

const planeReceiver = new NEXT.Plane({
  width: 10,
  height: 10,
  shader: material2
});

planeReceiver.receiveShadow = true;

planeReceiver.position.set(0, -4, 0);
planeReceiver.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
scene.add(planeReceiver);

const fb = new NEXT.FrameBuffer(window.innerWidth, window.innerHeight, {depth: true});
// const fb = null;

const flat2 = new NEXT.FlatMaterial({
  modifiers: {
    f_pars: () => `
      uniform sampler2D fbo;
    `,
    f_main: () => `
      // float n = 1.0;
      // float f = 100.0;
      // float z = texture(fbo, v_uv).x;
      // float grey = (2.0 * n) / (f + n - z*(f-n));
      // color = vec3(grey);
      color = texture(fbo, v_uv).xyz;
    `,
    v_main: () => `
      v_uv.y = 1.0 - v_uv.y;
    `
  },
  defines: {
    USE_UV: true
  }
});

setTimeout(() => {
  console.log(flat2.uniforms);
  flat2.uniforms.fbo = window.shadowMap.texture;
}, 1000);

// flat2

const plane = new NEXT.Plane({
  width: 4,
  height: 2,
  shader: flat2
});

plane.position.set(6, 0, 0);
// plane.quaternion.setFromEuler(-Math.PI, 0, 0);

// vec3.set(plane.position, 6, 0, 0);
// quat.rotateX(plane.quaternion, plane.quaternion, -Math.PI / 2);
scene.add(plane);

let cam = camera;

(function update() {
  requestAnimationFrame(update);

  controls.update();

  vec3.copy(cam.position.value, controls.position);
  const _mat4 = mat4.lookAt([], cam.position.value, vec3.add([], cam.position.value, controls.direction), controls.up);
  quat.copy(cam.quaternion.value, quat.fromMat3([], mat3.transpose([], mat3.fromMat4([], _mat4))));

  // orthoCamera.matrixAutoUpdate = false;
  // orthoCamera.matrix.copy(dirLight.matrix);
  // mat4.transpose(orthoCamera.matrix, orthoCamera.matrix);

  // plane.visible = false;
  // renderer.render(orthoCamera, fb);
  plane.visible = true;
  renderer.render(camera);
})();

console.log(orthoCamera);

renderer.setScene(scene);
// renderer.render(orthoCamera);

window.renderer = renderer;

// const sphereGeo = NEXT.Sphere.Geometry({
//   radius: 1
// });
//
// const mesh = new NEXT.Mesh(sphereGeo, {
//   shader: NEXT.shaders.default
// });

// scene.add(mesh);
