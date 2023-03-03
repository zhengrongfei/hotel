export const ROLES = {
  NONE: 0,
  CUSTOMER: 1,
  ADMIN: 2,
  EMPLOYEE: 3
}

export const ROLE_NAMES = {
  0: "not_signed_in",
  1: "customer",
  2: "admin",
  3: "employee"
}

export const LABELS = {
  ADMIN: {
    HOTELS: 1,
    REVIEWS: 2,
    OFFERS: 4,
    NOTICES: 8,
    USERS: 16,
    SUPPORT: 32,
  },
  EMPLOYEE: {
    SUPPORT: 1
  }
}

export const LABEL_NAMES = {
  2: {
    1: "hotels",
    2: "reviews",
    4: "offers",
    8: "notices",
    16: "users",
    32: "support"
  },
  3: {
    1: "support"
  }
}