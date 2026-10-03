export interface StaffProfile {
  full_name?: string;
  phone?: string;
  role?: string;
  hired_at?: string;
}

export interface UserProfileData {
  email?: string;
  staff_profile?: StaffProfile;
}