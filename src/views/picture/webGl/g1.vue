<template>
  <div id="container" ref="container">
  </div>
</template>

<script setup>
import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';

const container = ref(null); // 创建一个名为container的引用

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}

onMounted(() => {
  // 在组件挂载后将渲染器的DOM元素添加到#container
  container.value.appendChild(renderer.domElement);
  if (WebGL.isWebGLAvailable()) {

    // Initiate function or other initializations here
    animate();

  } else {

    const warning = WebGL.getWebGLErrorMessage();
    document.getElementById('container').appendChild(warning);

  }
});
</script>

<style lang="less" scoped>

</style>