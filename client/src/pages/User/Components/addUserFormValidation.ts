import type { UserFieldErrors } from "../../../interfaces/UserInterface";

const MAX_NAME_LEN = 55;
const MIN_AUTH_LEN = 6;
const MAX_AUTH_LEN = 12;
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

const IMAGE_MIME = new Set(["image/png", "image/jpeg", "image/jpg"]);

function trim(s: string): string {
  return s.trim();
}

export function validateAddUserForm(params: {
  firstName: string;
  middleName: string;
  lastName: string;
  suffixName: string;
  gender: string;
  birthDate: string;
  username: string;
  password: string;
  passwordConfirmation: string;
  profilePicture: File | null;
}): UserFieldErrors | null {
  const out: UserFieldErrors = {};

  const first = trim(params.firstName);
  if (!first) out.first_name = ["First name is required."];
  else if (first.length > MAX_NAME_LEN) {
    out.first_name = [`First name must not exceed ${MAX_NAME_LEN} characters.`];
  }

  const middle = trim(params.middleName);
  if (middle.length > MAX_NAME_LEN) {
    out.middle_name = [`Middle name must not exceed ${MAX_NAME_LEN} characters.`];
  }

  const last = trim(params.lastName);
  if (!last) out.last_name = ["Last name is required."];
  else if (last.length > MAX_NAME_LEN) {
    out.last_name = [`Last name must not exceed ${MAX_NAME_LEN} characters.`];
  }

  const suffix = trim(params.suffixName);
  if (suffix.length > MAX_NAME_LEN) {
    out.suffix_name = [`Suffix name must not exceed ${MAX_NAME_LEN} characters.`];
  }

  if (!trim(params.gender)) {
    out.gender = ["Gender is required."];
  }

  if (!params.birthDate) {
    out.birth_date = ["Birth date is required."];
  } else {
    const d = new Date(`${params.birthDate}T12:00:00`);
    if (Number.isNaN(d.getTime())) {
      out.birth_date = ["Birth date must be a valid date."];
    } else {
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (d > today) {
        out.birth_date = ["Birth date cannot be in the future."];
      }
    }
  }

  const username = trim(params.username);
  if (!username) out.username = ["Username is required."];
  else if (username.length < MIN_AUTH_LEN) {
    out.username = [`Username must be at least ${MIN_AUTH_LEN} characters.`];
  } else if (username.length > MAX_AUTH_LEN) {
    out.username = [`Username must not exceed ${MAX_AUTH_LEN} characters.`];
  }

  const password = params.password;
  if (!password) out.password = ["Password is required."];
  else if (password.length < MIN_AUTH_LEN) {
    out.password = [`Password must be at least ${MIN_AUTH_LEN} characters.`];
  } else if (password.length > MAX_AUTH_LEN) {
    out.password = [`Password must not exceed ${MAX_AUTH_LEN} characters.`];
  }

  if (!params.passwordConfirmation) {
    out.password_confirmation = ["Please confirm your password."];
  } else if (params.passwordConfirmation !== password) {
    out.password_confirmation = ["Password confirmation does not match."];
  }

  if (params.profilePicture) {
    const f = params.profilePicture;
    const mimeOk = IMAGE_MIME.has(f.type.toLowerCase());
    const nameOk = /\.(png|jpe?g)$/i.test(f.name);
    if (!mimeOk && !nameOk) {
      out.add_user_profile_picture = [
        "Profile picture must be a PNG, JPG, or JPEG file.",
      ];
    }
    if (f.size > MAX_IMAGE_BYTES) {
      const msg = "Profile picture must not exceed 2 MB.";
      out.add_user_profile_picture = [
        ...(out.add_user_profile_picture ?? []),
        msg,
      ];
    }
  }

  return Object.keys(out).length > 0 ? out : null;
}
