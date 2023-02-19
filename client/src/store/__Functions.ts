

// Save, Get and Delete token
export const saveToken = (token: string): void => {
  localStorage.setItem("token", token)
}

export const getToken = (): string | null => {
  return localStorage.getItem("token")
}

export const deleteToken = (): void => {
  localStorage.removeItem("token")
}



// Save, Get and Delete Search Input
const SECRET_INPUT_KEY = (): string => {
  return "UHIEHG90Y92USHGIHSH"
}

export const saveSearchInput = (input: string | undefined): void => {
  console.log(input)
  if (input) {
    localStorage.setItem(SECRET_INPUT_KEY(), input)
  }
}

export const getSearchInput = (): string | null => {
  return localStorage.getItem(SECRET_INPUT_KEY())
}

export const deleteSearchInput = (): void => {
  localStorage.removeItem(SECRET_INPUT_KEY())
}



// Date format function
export const FormatNumber = (string: string | undefined): string | undefined => {
  if (string) {
    const [day, month, year] = string.split("/");
    const Format = new Intl.NumberFormat(undefined, { minimumIntegerDigits: 2, });
    const monthFormat = Format.format(parseInt(month));
    const dayFormat = Format.format(parseInt(day));

    return `${dayFormat}/${monthFormat}/${year}`
  } else {
    return undefined;
  }
}
