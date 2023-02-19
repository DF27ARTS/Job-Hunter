import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { openFormCreateCard } from "../components/FormCreateCard";
import { API_URL } from "./userSlice";
import { deleteSearchInput, getToken } from "./__Functions";


export interface Card {
  id?: number;
  title?: string;
  company: string;
  role: string;
  status: string;
  description: string;
  date?: string;
}

interface cardState {
  cards: Card[][];
  cardToUpdate: Card | any;
  arrayDates: string[] | any;
  loading_cards: boolean;
  loading_single_card: boolean;
  grid_columns: number;
  card_error: boolean;
  create_form_active: boolean; 
  searchError: boolean; 
  showCardsByStatus: boolean;
  cardCreatedLoading: boolean;
  loadingSlice: boolean;
  columnSliceAvailable: boolean;
  currentPropertyValue: string;
}

const initialState:cardState = {
  cards: [[]],
  cardToUpdate: {
    company: "",
    role: "",
    status: "",
    description: "",
  },
  arrayDates: [],
  loading_cards: false,
  loading_single_card: false,
  grid_columns: 1,
  card_error: false,
  create_form_active: false,
  searchError: false,
  showCardsByStatus: false,
  cardCreatedLoading: false,
  loadingSlice: false,
  columnSliceAvailable: true,
  currentPropertyValue: "role",
}

export const getCards = createAsyncThunk<Card[][] | any>(
  "cards/getCards",
  async (_, ThunkAPI) => {
    try {
      const { data } = await axios.get(`${API_URL}/cards`, {
        headers: {
          Authorization: getToken(),
        },
      })
      return data
    } catch (error) {
      return ThunkAPI.rejectWithValue(error)
    }
  }
)

export const getCardsSliced = createAsyncThunk< Card[][] | any, string, any>(
  "cards/getCardsSliced",
  async (date, ThunkAPI) => {
    try {
      const { data } = await axios.get(`${API_URL}/cards?initialDate=${date}`, {
        headers: {
          Authorization: getToken(),
        },
      })
      return data
    } catch (error) {
      return ThunkAPI.rejectWithValue(error)
    }
  }
)

export const getCardsBySearchInput = createAsyncThunk<Card[][] | any, Card | any>(
  "cards/getCardsBySearchInput",
  async (search, ThunkAPI) => { 
    const config = {
      headers: { Authorization: `Bearer ${getToken()}` }
    };
    try {
      const { data } = await axios.get(`${API_URL}/cards/search?property=${search.property}&input=${search.input}`,
        config
      )
      return data;
    } catch (error) {
      ThunkAPI.dispatch(getCards());
      return ThunkAPI.rejectWithValue(error);
    }
  }
)

export const getSlicedCardsBySearchInput = createAsyncThunk<Card[][] | any, Card | any>(
  "cards/getSlicedCardsBySearchInput",
  async (search, ThunkAPI) => { 
    const config = {
      headers: { Authorization: `Bearer ${getToken()}` }
    };
    try {
      const { data } = await axios.get(
        `${API_URL}/cards/search?property=${search.property}&input=${search.input}&initialDate=${search.initialDate}`,
        config
      )
      return data;
    } catch (error) {
      return ThunkAPI.rejectWithValue(error);
    }
  }
)

export const createCard = createAsyncThunk<Object | any, Card | any> (
  "cards/createCard",
  async (card, ThunkAPI) => {
    const config = {
      headers: { Authorization: `Bearer ${getToken()}` }
    };

    try {
      const { data } = await axios.post(`${API_URL}/cards`,
        card,
        config
      )
      ThunkAPI.dispatch(getDates())
      return data.card
    } catch (error) {
      return ThunkAPI.rejectWithValue(error)
    }
  }
)

export const updateCard = createAsyncThunk<Card | any, Card | any>(
  "cards/updateCard",
  async (card, ThunkAPI) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${getToken()}` }
      };
      const { data } = await axios.put(`${API_URL}/cards?card_id=${card.id}`,
        card,
        config
      )
      return data.card
    } catch (error) {
      return ThunkAPI.rejectWithValue(error);
    }
  }
)

export const deleteCard = createAsyncThunk<any, number | undefined>(
  "cards/deleteCard",
  async (id, ThunkAPI) => {
    try {
      const value = await axios.delete(`${API_URL}/cards?card_id=${id}`, {
        headers: {
          Authorization: getToken(),
        },
      })
      return id
    } catch (error) {
      return ThunkAPI.rejectWithValue(error)
    }
  }
)

export const getDates = createAsyncThunk<any | string[]>(
  "cards/getDates",
  async (_, ThunkAPI) => {
    try {
      
      const { data } = await axios.get(`${API_URL}/get_dates`, {
        headers: {
          Authorization: getToken(),
        },
      });
      return data

    } catch (error) {
      return ThunkAPI.rejectWithValue(error)
    }
  }
)
  
export const deleteCardByDate = createAsyncThunk<any, any>(
  "cards/deleteCardByDate",
  async (date, ThunkAPI) => {
    try {
      
      const {status} = await axios.delete(`${API_URL}/delete_by_date?date=${date}`, {
        headers: {
          Authorization: getToken(),
        },
      })
      if (status === 200) {
        ThunkAPI.dispatch(getCards())
        return date;
      } else {
        return "Error"
      }

    } catch (error) {
      return ThunkAPI.rejectWithValue(error)
    }
  }
)

export const deleteAllRejectedCards = createAsyncThunk(
  "cards/deleteAllRejectedCards",
  async (_, ThunkAPI) => {
    try {
      
      const { status } = await axios.delete(`${API_URL}/delete_rejected`, {
        headers: {
          Authorization: getToken()
        }
      })

      if (status === 200) {
        ThunkAPI.dispatch(getCards())
      } else {
        return "Error"
      }
    } catch (error) {
      return ThunkAPI.rejectWithValue(error)
    }
  }
)

export const CardSlice = createSlice({
  name: "card",
  initialState: initialState,
  reducers: {
    clearStorage: (state) => {
      state.cards = [[]]
      state.loading_cards = true
      state.loading_single_card = true
    },
    closeCardError: (state) => { state.card_error = false },
    activateForm: (state) => {
      state.create_form_active = true;
    },
    deactivateForm: (state) => {
        state.create_form_active = false;
        state.cardToUpdate = {}
    },
    setCardToUpdate: (state, action) => {
      state.cardToUpdate = action.payload
      state.create_form_active = true
    },
    cleanCardToUpdate: (state) => { state.cardToUpdate = {} },
    closeInputError: (state) => { state.searchError = false },
    setShowByStatus: (state, {payload}) => { state.showCardsByStatus = payload },
    closeLoading: (state) => { state.loading_single_card = false; },
    openLoading: (state) => { state.loading_single_card = true ;},
    cleanCurrentPropertyValue: (state) => {
      state.currentPropertyValue = "role";
      state.columnSliceAvailable = true;
    },
    setColumnSliceAvailable: (state) => { state.columnSliceAvailable =  true },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCards.pending, (state) => { state.loading_cards = true})
      .addCase(getCards.fulfilled, (state, {payload}) => {
        state.loading_cards = true
        state.columnSliceAvailable = true
        if (state.showCardsByStatus) {
          const showByStatusCards = orderByStatus(payload.cards)
          state.cards = showByStatusCards
          state.grid_columns = showByStatusCards.length
        } else {
          state.cards = payload.cards
          state.grid_columns = payload.cards.length
        }

        if (payload.lastSlice) state.columnSliceAvailable = false
        
        state.loading_cards = false
        state.loading_single_card = false
      })
      .addCase(getCards.rejected, (state) => {
        state.loading_cards = false
        state.loading_single_card = false
      })

    builder
      .addCase(getCardsSliced.pending, (state) => {
        state.loadingSlice = true
        state.grid_columns = state.cards.length + 1
      })
      .addCase(getCardsSliced.fulfilled, (state, { payload }) => {
        state.cards = [...state.cards, ...payload.cards]
        state.grid_columns = state.grid_columns + payload.cards.length - 1;
        state.columnSliceAvailable = true
        state.loadingSlice = false
        
        if (payload.lastSlice) 
          state.columnSliceAvailable = false
        
      })
      .addCase(getCardsSliced.rejected, (state) => {
        state.loadingSlice = false
        state.grid_columns = state.grid_columns - 1
        state.columnSliceAvailable = true;
      })

    builder
      .addCase(getCardsBySearchInput.pending, (state) => {
        state.loading_cards = true
        state.loading_single_card = true
        state.columnSliceAvailable = true
      })
      .addCase(getCardsBySearchInput.fulfilled, (state, {payload}) => {
        state.loading_cards = true
        state.columnSliceAvailable = true
        if (state.showCardsByStatus) {
          const showByStatusCards = orderByStatus(payload.cards)
          state.cards = showByStatusCards
          state.grid_columns = showByStatusCards.length
        } else {
          state.cards = payload.cards
          state.grid_columns = payload.cards.length
        }

        if (payload.lastSlice) state.columnSliceAvailable = false
        
        state.loading_cards = false
        state.loading_single_card = false
      })
      .addCase(getCardsBySearchInput.rejected, (state) => {
        state.loading_cards = false;
        state.searchError = true;
        state.loading_single_card = false;
      })

    builder
      .addCase(getSlicedCardsBySearchInput.pending, (state) => {
        state.loadingSlice = true
        state.grid_columns = state.cards.length + 1
      })
      .addCase(getSlicedCardsBySearchInput.fulfilled, (state, {payload}) => {

        state.cards = [...state.cards, ...payload.cards]
        state.grid_columns = state.grid_columns + payload.cards.length - 1;
        state.columnSliceAvailable = true
        state.loadingSlice = false
        
        if (payload.lastSlice) 
          state.columnSliceAvailable = false
      })
      .addCase(getSlicedCardsBySearchInput.rejected, (state) => {
        state.loadingSlice = false
        state.grid_columns = state.grid_columns - 1
        state.columnSliceAvailable = false
        deleteSearchInput()
      })

    builder
      .addCase(createCard.pending, (state) => { state.cardCreatedLoading = true})
      .addCase(createCard.fulfilled, (state, action) => {

        if (state.showCardsByStatus) {
          let cardSaved = false;

          if (!state.cards[0].length) {
            state.columnSliceAvailable = false
          }

          // Map the cards to put the new card on its column
          if (state.cards[0].length) {
            state.cards.map((cardsArray, index) => {
              if (cardsArray[1].status === action.payload.status) {
                state.cards[index] = [state.cards[index][0], action.payload, ...state.cards[index].filter(card => !card.title)]
                cardSaved = true;
              }
            })
          }


          // Create and order the new column in case it doesn't exist already
          if (!cardSaved) {
            const Array = [...state.cards, [{title: action.payload.status }, action.payload] ]
            const newArray = Array.filter(array => array.length)
            state.cards = newArray;
            state.grid_columns = newArray.length;
            state.cards = state.cards.sort((a: any, b: any): any => {
              if (a.length && b.length) {
                const arrayA = a[0].title[0].charCodeAt()
                const arrayB = b[0].title[0].charCodeAt()
                return arrayA - arrayB
              }
            })
          }

          state.cardCreatedLoading = false
          state.loading_cards = false
          state.create_form_active = false
          return
        }
          
        if (state.cards[0].length && state.cards[0][1].date !== action.payload.date) {
          state.cards = [
            [
              { title: action.payload.date },
              action.payload
            ],
            ...state.cards
          ]
          state.grid_columns = state.grid_columns + 1
        }
        else if (!state.cards[0].length) {
          state.cards[0] = [{ title: action.payload.date }, action.payload];
          state.grid_columns = 1
        } else {
          const newArray = [
            state.cards[0][0],
            action.payload
          ];
          state.cards[0].map(card => {
            if (!card.title) {
              newArray.push(card)
            }
          })
          state.cards[0] = newArray;
        }
        state.cardCreatedLoading = false
        state.loading_cards = false
        state.create_form_active = false
      })
      .addCase(createCard.rejected, (state) => {
        state.cardCreatedLoading = false
        state.card_error = true
        openFormCreateCard()
      })

    builder
      .addCase(deleteCard.pending, (state) => { state.loading_single_card = true})
      .addCase(deleteCard.fulfilled, (state, action) => {
        if (state.cards[0].length <= 2 && state.cards[1]) {
          state.cards = state.cards.filter(cardsArray => cardsArray !== state.cards[0])
          state.grid_columns = state.cards.length
        }
        else if (state.cards[0].length <= 2) {
          state.cards[0] = []
          getCards()
        } else {
          state.cards.map((_, index) => {
            state.cards[index] = state.cards[index].filter(card => card.id !== action.payload)
          })
        }
        state.loading_single_card = false
      })
      .addCase(deleteCard.rejected, (state) => {
        state.loading_single_card = false
        state.card_error = true
      })

    builder
      .addCase(updateCard.pending, (state) => { state.cardCreatedLoading = true})
      .addCase(updateCard.fulfilled, (state, action) => {
        state.cards.map((cardArray, index) => {
          cardArray.map((card, ind) => {
            if (card.id === action.payload.id) {
              state.cards[index][ind] = action.payload;
            }
          })
        })
        if (state.showCardsByStatus) {
          state.cards = orderByStatus(state.cards)
          state.grid_columns = orderByStatus(state.cards).length
        } 
        state.cardCreatedLoading = false
        state.create_form_active = false
        state.loading_single_card = false
      })
      .addCase(updateCard.rejected, (state) => {
        state.cardCreatedLoading = false
        state.card_error = true
        state.loading_single_card = false
      })
    
    builder
      .addCase(getDates.fulfilled, (state, action) => { state.arrayDates = action.payload;})
    builder
      .addCase(deleteCardByDate.pending, (state) => { state.loading_single_card = true; })
      .addCase(deleteCardByDate.fulfilled, (state, action) => {
        if (state.cards.length === 1) {
          state.cards = [[]]
          state.arrayDates = []
        } else {
          state.cards = state.cards.filter(cardsArray => cardsArray[0].title !== action.payload );
          state.arrayDates = state.arrayDates.filter((date: string) => date !== action.payload)
        }
      })
      .addCase(deleteCardByDate.rejected, (state) => { state.loading_single_card = false; })
    builder
      .addCase(deleteAllRejectedCards.pending, (state) => { state.loading_single_card = true })
      .addCase(deleteAllRejectedCards.fulfilled, (state) => { state.loading_single_card = false })
      .addCase(deleteAllRejectedCards.rejected, (state) => { state.loading_single_card = false })
  }
})


function orderByStatus(value:Card[][] | any ): any{
  const applyed = [{ title: "applyed" }];
  const interview = [{ title: "interview" }];
  const rejected = [{ title: "rejected" }];

  value.map((cardArray:Card[]) => {
    cardArray.map((card: Card | any ) => {
      if (card.status === "applyed") {
        if (!card.title) {
          applyed.push(card);
        }
      }
      if (card.status === "interview") {
        if (!card.title) {
          interview.push(card);
        }
      }
      if (card.status === "rejected") {
        if (!card.title) {
          rejected.push(card);
        }
      }
    })
  });

  const CardsFilterByStatus = [];
  if (applyed.length > 1) {
    CardsFilterByStatus.push(applyed)
  }
  if (interview.length > 1) {
    CardsFilterByStatus.push(interview)
  }
  if (rejected.length > 1) {
    CardsFilterByStatus.push(rejected)
  }

  return CardsFilterByStatus
}

export default CardSlice.reducer
export const {
  clearStorage,
  closeCardError,
  activateForm,
  deactivateForm,
  setCardToUpdate,
  cleanCardToUpdate,
  closeInputError,
  setShowByStatus,
  closeLoading,
  openLoading,
  cleanCurrentPropertyValue,
  setColumnSliceAvailable,
} = CardSlice.actions

