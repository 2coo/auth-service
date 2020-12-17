export interface OpenIDStandardClaims {
  email?: string
  email_verified?: boolean
  name?: string
  given_name?: string
  family_name?: string
  middle_name?: string
  nickname?: string
  preferred_username?: string
  profile?: string
  picture?: string
  website?: string
  gender?: string
  birthdate?: string
  zoneinfo?: string
  locale?: string
  phone_number?: string
  phone_number_verified?: boolean
  address?: string
  groups?: string[]
  device_key?: string
  updated_at?: string
}
