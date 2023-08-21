<template>
  <Suspense>
    <TresCanvas clear-color="#82DBC5" preserve-drawing-buffer shadows alpha window-size>
      <TresPerspectiveCamera ref="cameraRef" :args="[45, 1, 0.1, 1000]" />
      <OrbitControls />

      <TresMesh ref="blobRef" :position="[-3, 0, 0]">
        <TresSphereGeometry />
        <TresShaderMaterial :vertex-shader="vertexShader" :fragment-shader="fragmentShader" :uniforms="uniforms" />
      </TresMesh>

      <TresMesh ref="boxRef" :scale="1" cast-shadow>
        <TresBoxGeometry :args="[1, 1, 1]" />
        <TresMeshStandardMaterial />
      </TresMesh>

      <TresMesh :position="[2, 4, 0]">
        <TresTorusKnotGeometry :args="[1, 0.4, 100, 16]" />
        <TresMeshPhysicalMaterial :color="'#26ff9c'" :emissive="'#77468b'" :metalness="1" :roughness="0.7" :clearcoat="1" />
      </TresMesh>

      <TresMesh :position="[2, 8, 0]">
        <TresTorusKnotGeometry />
        <TresMeshPhongMaterial :shininess="5" color="red" specular="red" />
      </TresMesh>

      <TresMesh :position="[2, 12, 0]">
        <TresTorusKnotGeometry />
        <TresMeshPhongMaterial :shininess="100" color="red" specular="red" />
      </TresMesh>

      <TresGroup ref="groupRef" :position="[2, 0, 0]" cast-shadow>
        <TresMesh :scale="[1, 2, 0.5]" :rotation="[Math.PI / 4, 0, 0]">
          <TresBoxGeometry />
          <TresMeshToonMaterial color="red" />
        </TresMesh>
        <TresMesh :position="[1, 0, 0]" @click="changeSphereColor">
          <TresSphereGeometry />
          <TresMeshBasicMaterial :color="sphereColor" />
        </TresMesh>
      </TresGroup>

      <TresMesh :scale="1" :position="[6, 0, 0]" cast-shadow>
        <TresTorusKnotGeometry :args="[1, 0.2, 16, 32]" />
        <TresMeshNormalMaterial />
      </TresMesh>

      <TresMesh :scale="1" :position="[10, 0, 0]" cast-shadow>
        <TresTorusKnotGeometry :args="[1, 0.4, 100, 16]" />
        <TresMeshNormalMaterial />
      </TresMesh>

      <TresMesh :position="[16, 0, 0]">
        <TresBufferGeometry :position="[positionArray, 3]" />
        <TresMeshBasicMaterial color="#ff0000" wireframe />
      </TresMesh>

      <primitive :object="scene" :position="[13, -2, 0]" />

      <Text3D
        :position="[-5, 0, 0]"
        font="https://raw.githubusercontent.com/Tresjs/assets/main/fonts/FiraCodeRegular.json"
      >
        text text
        <TresMeshNormalMaterial />
      </Text3D>

      <TresDirectionalLight :position="[2, 2, 4]" :intensity="1" />
      <TresAmbientLight :intensity="0.1" />
      <TresAxesHelper />
      <TresGridHelper :args="[10, 10, 0x444444, 'teal']" />
    </TresCanvas>
  </Suspense>
</template>

<script lang="ts" setup>
import { TresCanvas, TresObject } from '@tresjs/core'
import { OrbitControls, Text3D, useTweakPane } from '@tresjs/cientos'
import { ShallowRef } from 'vue'
import { Color, Intersection, PerspectiveCamera, Vector2 } from 'three'
import gsap from 'gsap'
import vertexShader from '../components/shaders/vertex.glsl'
import fragmentShader from '../components/shaders/fragment.glsl'

const boxRef: ShallowRef<TresObject | null> = shallowRef(null)

// const texture = await useTexture(['land_ocean_ice_cloud_2048.jpg'])
// const texture = await useTexture({
//     map: 'https://raw.githubusercontent.com/Tresjs/assets/main/textures/black-rock/Rock035_2K_Displacement.jpg',
//     displacementMap:
//         'https://raw.githubusercontent.com/Tresjs/assets/main/textures/black-rock/Rock035_2K_Displacement.jpg',
//     roughnessMap:
//         'https://raw.githubusercontent.com/Tresjs/assets/main/textures/black-rock/Rock035_2K_Roughness.jpg',
//     normalMap:
//         'https://raw.githubusercontent.com/Tresjs/assets/main/textures/black-rock/Rock035_2K_NormalGL.jpg',
//     ambientOcclusion:
//         'https://raw.githubusercontent.com/Tresjs/assets/main/textures/black-rock/Rock035_2K_AmbientOcclusion.jpg',
// });

const sphereColor = ref<Color>(new Color('blue'))
function changeSphereColor(intersection: Intersection) {
  // sphereColor.value = sphereColor.value.equals(new Color( 'red' )) ? new Color( 'blue') : new Color( 'red' )
  sphereColor.value = new Color(
    intersection.distance / 100,
    intersection.distance / 100,
    (intersection.distance / 100) * 10,
  )
}

// const { scene } = await useLoader(
//     GLTFLoader,
//     'https://raw.githubusercontent.com/Tresjs/assets/main/models/gltf/aku-aku/AkuAku.gltf'
// );
const { scene } = await useGLTF('https://raw.githubusercontent.com/Tresjs/assets/main/models/gltf/aku-aku/AkuAku.gltf')

const cameraRef = shallowRef<PerspectiveCamera>()
watch(cameraRef, (camera) => {
  if (camera) {
    gsap.to(camera.position, {
      delay: 1,
      duration: 2,
      x: 11,
      y: 11,
      z: 11,
      ease: 'power3.out',
      onUpdate() {
        camera.lookAt(0, 0, 0)
      },
    })
  }
})

const positionArray = new Float32Array([0, 0, 0, 0, 1, 0, 1, 0, 0])

const blobRef: ShallowRef<TresObject | null> = shallowRef(null)
const uniforms = {
  uTime: { value: 0 },
  uAmplitude: { value: new Vector2(0.1, 0.1) },
  uFrequency: { value: new Vector2(20, 5) },
}

const { onLoop, resume } = useRenderLoop()
onLoop(({ delta, elapsed }) => {
  if (boxRef.value) {
    boxRef.value.rotation.y += delta
    boxRef.value.rotation.z = elapsed * 0.2

    boxRef.value.position.y = Math.sin(elapsed * 2)

    boxRef.value.scale.set(Math.sin(elapsed * 0.5), Math.sin(elapsed * 0.5), Math.sin(elapsed * 0.5))
  }

  if (blobRef.value) {
    blobRef.value.material.uniforms.uTime.value = elapsed
  }
})
resume()

// crash
// useTweakPane()
</script>
