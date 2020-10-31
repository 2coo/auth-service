import { objectType } from '@nexus/schema'

export const Photo = objectType({
  name: 'Photo',
  definition(t) {
    t.model.profile()
  },
})
