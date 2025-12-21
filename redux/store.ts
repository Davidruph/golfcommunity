import { configureStore, combineReducers } from '@reduxjs/toolkit'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  PersistConfig,
} from 'redux-persist'
import { encryptTransform } from 'redux-persist-transform-encrypt'
import storage from 'redux-persist/lib/storage'
import apiSlice from '../service/apiSlice'
import user from './slices/user.slice'

const rootReducer = combineReducers({
  user,
  [apiSlice.reducerPath]: apiSlice.reducer,
})

type RootReducerState = ReturnType<typeof rootReducer>

const transforms =
  typeof window !== 'undefined'
    ? [
        encryptTransform({
          secretKey: process.env.NEXT_PUBLIC_ENCRYPT_KEY || '',
          onError: function (error) {
            console.log(error)
          },
        }),
      ]
    : []

const persistConfig: PersistConfig<RootReducerState> = {
  key: 'root',
  storage,
  version: 1,
  transforms,
  blacklist: [apiSlice.reducerPath],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware),
})

const persistor = persistStore(store)

store.subscribe(() => console.log(store.getState()))

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch

export { store, persistor }
