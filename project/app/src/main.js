import App from './App.vue' // App.jsx
import routes from './routes'
import vitedge from 'vitedge'
import {createPinia} from 'pinia'
import './index.css'

import devalue from '@nuxt/devalue'

export default vitedge(
    App,
    { routes,
        transformState(state) {
            return import.meta.env.SSR ? devalue(state) : state
        },
    },
    ({ app, router, isClient, initialState }) => {
        // Custom setup hook.
        // E.g. set initialState in a store, install plugins, etc.

        const pinia = createPinia()

        // Sync initialState with the store:
        if (import.meta.env.SSR) {
            initialState.pinia = pinia.state.value
        } else {
            pinia.state.value = initialState.pinia
        }

        app.use(pinia)
    }
)
