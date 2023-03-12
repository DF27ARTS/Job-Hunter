

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






// save (show cards amount status)
export const setShowCardAmount = (value: string | undefined): void => {
  if (value) {
    const getCurrentArray = localStorage.getItem("ShowCardAmount")
    const ColumnsWithShowCardAmountClosed = getCurrentArray ? `${getCurrentArray},${value}` : value
    localStorage.setItem("ShowCardAmount", ColumnsWithShowCardAmountClosed)
  }
}

export const getShowCardAmount = (value: string | undefined): boolean => {
  if (value) {
    const currentArray: string | null = localStorage.getItem("ShowCardAmount")
    const cardStatus = currentArray?.split(",").find(currentValue =>  currentValue === value)
    return cardStatus ? true : false
  } else {
    return false
  }
}

export const deleteShowCardAmount = (value: string | undefined): void => {
  if (value) {
    const currentArray: string | null = localStorage.getItem("ShowCardAmount")

    const cardsAmountFilter =  currentArray?.split(",").filter(currentValue =>  currentValue !== value).join(",") 
    cardsAmountFilter !== undefined && localStorage.setItem("ShowCardAmount", cardsAmountFilter)
  }
}