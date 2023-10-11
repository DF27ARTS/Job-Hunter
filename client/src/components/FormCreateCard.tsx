import React, { useEffect, useState } from "react";
import {
  Card,
  cleanCardToUpdate,
  createCard,
  deactivateForm,
  updateCard,
} from "../store/cardSlice";
import { useAppDispatch, useAppSelector } from "../store/store";
import closeForm from "../assets/close-create-form.svg";
import stageOneBackground from "../assets/stage-one-background.jpg";
import stageTowBackground from "../assets/stage-two-background.jpg";
import stageThreeBackground from "../assets/stage-three-background.jpg";
import stageFourBackground from "../assets/stage-four-background.jpg";

import JobHunter_Icon from "../assets/JobHunter-Icon.png";

import "../styles/FormCreateCard.scss";
import { scrollFirstColumnIntoView } from "./SingleColumn";

export const openFormCreateCard = (): void => {
  setTimeout(() => {
    const createCardForm = document.querySelector(".create-card-form");
    const formContainer = document.querySelector(".form-container");
    const closeCreateForm = document.querySelector(".close-create-form");

    createCardForm?.classList.add("create-form-activated");
    formContainer?.classList.add("form-container-activated");
    closeCreateForm?.classList.add("close-create-form-active");
  }, 50);
};

const closeFormCreateCard = (): void => {
  const createCardForm = document.querySelector(".create-card-form");
  const formContainer = document.querySelector(".form-container");
  const closeCreateForm = document.querySelector(".close-create-form");

  createCardForm?.classList.remove("create-form-activated");
  formContainer?.classList.remove("form-container-activated");
  closeCreateForm?.classList.remove("close-create-form-active");
};

const FormCreateCard = () => {
  const dispatch = useAppDispatch();
  const { cardToUpdate, cardCreatedLoading } = useAppSelector(
    (state) => state.card
  );

  const currentTranslateValue = getComputedStyle(document.documentElement)
    .getPropertyValue("--height-form")
    .replace("vh", "");

  const viewportValue = getComputedStyle(document.documentElement)
    .getPropertyValue("--height-form")
    .replace(/\d.*\d/, "");

  const [input, setInput] = useState<Card>({
    company: cardToUpdate.company,
    description: cardToUpdate.description,
    role: cardToUpdate.role,
    status: cardToUpdate.status,
  });

  const HandleFormChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setInput({
      ...input,
      [name]: value,
    });
  };

  const HandleSubmit = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    e.preventDefault();
    if (cardToUpdate.id) {
      const value = {
        company: input.company,
        description: input.description && input.description.toLocaleLowerCase(),
        role: input.role,
        status: input.status,
      };
      dispatch(updateCard({ id: cardToUpdate.id, ...value }));
      dispatch(cleanCardToUpdate());
    } else {
      const value = {
        company: input.company,
        description: input.description && input.description.toLocaleLowerCase(),
        role: input.role,
        status: input.status,
        date: new Date().toLocaleDateString(),
      };
      dispatch(createCard(value));
      setInput({
        company: "",
        role: "",
        status: "",
        description: "",
      });
      scrollFirstColumnIntoView();
    }
    SetTranslateVariable(`0vh`);
  };

  const SelectOption = (value: string): void => {
    setInput({
      ...input,
      status: value,
    });
  };

  const HandleCloseForm = (): void => {
    closeFormCreateCard();
    setTimeout(() => {
      dispatch(deactivateForm());
      SetTranslateVariable(`0vh`);
    }, 300);
  };

  const SetTranslateVariable = (value: string) => {
    const newValue = (value + viewportValue).replace(" ", "");
    document.documentElement.style.setProperty(
      "--slider-translate",
      `${newValue}`
    );
  };

  const currentValue = (): number => {
    return parseInt(currentTranslateValue);
  };

  const HandleSubmitForm = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
  };

  return (
    <div className="create-card-form">
      <div
        className={
          cardCreatedLoading
            ? "close-create-form close-form-loading-active"
            : "close-create-form"
        }
      >
        <img
          className="close-form-icon"
          tabIndex={0}
          onClick={() => HandleCloseForm()}
          src={closeForm}
        />
        <img src={JobHunter_Icon} className="form-jobhunter-icon" />
      </div>
      <form
        onSubmit={HandleSubmitForm}
        autoComplete="off"
        className={
          cardCreatedLoading
            ? "form-container form-loading-active create-card-form-display-none"
            : "form-container"
        }
      >
        <div className="slider-container">
          <div className="stage-one">
            <img src={stageOneBackground} className="stage-one-img" />
            <h2 className="create-card-form-title">Create New Card</h2>
            <div area-text="" className="inputs">
              <input
                name="company"
                value={input.company}
                onChange={(e) => HandleFormChange(e)}
                placeholder="Company Name *"
                type="text"
                spellCheck="false"
              />
              {!input.company ? (
                <button className="not-allowed">Next</button>
              ) : (
                <button
                  onClick={() => SetTranslateVariable(`${currentValue() * -1}`)}
                >
                  Next
                </button>
              )}
            </div>
          </div>

          <div className="stage-two">
            <img src={stageTowBackground} className="stage-two-img" />
            <span>Write the job title here!!!</span>
            <div area-text="" className="inputs">
              <button
                className="stage-two-buttons"
                onClick={() => SetTranslateVariable(`${0}`)}
              >
                Prev
              </button>
              <input
                name="role"
                value={input.role}
                onChange={(e) => HandleFormChange(e)}
                placeholder="Job Title *"
                type="text"
                className="role"
                spellCheck="false"
              />
              {!input.role ? (
                <button className="not-allowed stage-two-buttons">Next</button>
              ) : (
                <button
                  className="stage-two-buttons"
                  onClick={() => SetTranslateVariable(`${currentValue() * -2}`)}
                >
                  Next
                </button>
              )}
            </div>
          </div>

          <div className="stage-three">
            <img src={stageThreeBackground} className="stage-three-img" />
            <span>Select the status of your application</span>
            <div area-text="" className="inputs">
              <button
                className="before-and-after-buttons stage-three-btn-one"
                onClick={() => SetTranslateVariable(`${currentValue() * -1}`)}
              >
                Prev
              </button>
              <div
                area-button={input.status === "applied" ? "applied" : ""}
                className="status-option status-one"
                area-text="applied"
                onClick={() => SelectOption("applied")}
              >
                Applied
              </div>
              <div
                area-button={input.status === "interview" ? "interview" : ""}
                className="status-option status-two"
                area-text="interview"
                onClick={() => SelectOption("interview")}
              >
                Interview
              </div>
              <div
                area-button={input.status === "rejected" ? "rejected" : ""}
                className="status-option status-three"
                area-text="rejected"
                onClick={() => SelectOption("rejected")}
              >
                Rejected
              </div>
              {!input.status ? (
                <button className="before-and-after-buttons not-allowed stage-three-btn-two">
                  Next
                </button>
              ) : (
                <button
                  className="before-and-after-buttons stage-three-btn-two"
                  onClick={() => SetTranslateVariable(`${currentValue() * -3}`)}
                >
                  Next
                </button>
              )}
            </div>
          </div>

          <div className="stage-four">
            <img src={stageFourBackground} className="stage-four-img" />
            <span>
              Write any type of information about the position <br />
            </span>
            <div area-text="" className="inputs">
              <button
                className="description-prev-button"
                onClick={() => SetTranslateVariable(`${currentValue() * -2}`)}
              >
                Prev
              </button>
              <textarea
                name="description"
                value={input.description}
                onChange={(e) => HandleFormChange(e)}
                placeholder="Description of the role"
                className="description"
                spellCheck="false"
              />
            </div>

            <button
              onClick={(e) => HandleSubmit(e)}
              className="create-card-form-button"
            >
              Save Card
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FormCreateCard;
