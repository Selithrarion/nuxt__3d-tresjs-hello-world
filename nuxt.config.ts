import glsl from 'vite-plugin-glsl';

export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ['@tresjs/nuxt'],

  // @ts-ignore
  vite: {
    plugins: [
        glsl()
    ]
  }
})
