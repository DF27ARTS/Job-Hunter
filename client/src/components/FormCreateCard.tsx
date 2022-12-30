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

import "../styles/FormCreateCard.scss";

const FormCreateCard = () => {
  const dispatch = useAppDispatch();
  const { cardToUpdate } = useAppSelector((state) => state.card);

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

  const HandleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (cardToUpdate.id) {
      const value = {
        company: input.company.toLocaleLowerCase(),
        description: input.description && input.description.toLocaleLowerCase(),
        role: input.role.toLocaleLowerCase(),
        status: input.status.toLocaleLowerCase(),
      };
      dispatch(updateCard({ id: cardToUpdate.id, ...value }));
      dispatch(cleanCardToUpdate());
    } else {
      const value = {
        company: input.company.toLocaleLowerCase(),
        description: input.description && input.description.toLocaleLowerCase(),
        role: input.role.toLocaleLowerCase(),
        status: input.status.toLocaleLowerCase(),
      };
      dispatch(createCard(value));
      setInput({
        company: "",
        role: "",
        status: "",
        description: "",
      });
    }
  };

  const SelectOption = (value: string): void => {
    setInput({
      ...input,
      status: value,
    });
  };

  const HandleCloseForm = (): void => {
    const createCardForm = document.querySelector(".create-card-form");
    createCardForm?.classList.remove("create-form-activated");
    setTimeout(() => {
      dispatch(deactivateForm());
    }, 300);
  };

  return (
    <form onSubmit={(e) => HandleSubmit(e)} className="create-card-form">
      <h2 className="create-card-form-title">New Job</h2>
      <input
        name="company"
        value={input.company}
        onChange={(e) => HandleFormChange(e)}
        placeholder="Company"
        type="text"
        className="company"
        required={true}
      />
      <input
        name="role"
        value={input.role}
        onChange={(e) => HandleFormChange(e)}
        placeholder="Job Title"
        type="text"
        className="role"
        required={true}
      />
      <div tabIndex={-1} className="status">
        {!input.status ? <span>Status</span> : <p>{input.status}</p>}
        <input
          autoComplete="off"
          name="status"
          value={input.status}
          onChange={(e) => HandleFormChange(e)}
          type="text"
          required={true}
        />
        <div className="container-single-option">
          <span area-text="applyed" onClick={() => SelectOption("applyed")}>
            <span>Applyed</span>
          </span>
          <span area-text="interview" onClick={() => SelectOption("interview")}>
            <span>Interview</span>
          </span>
          <span area-text="rejected" onClick={() => SelectOption("rejected")}>
            <span>Rejected</span>
          </span>
        </div>
      </div>

      <textarea
        name="description"
        value={input.description}
        onChange={(e) => HandleFormChange(e)}
        placeholder="Description"
        className="description"
      ></textarea>
      <button className="create-card-form-button">Save Card</button>
      <img
        tabIndex={0}
        onClick={() => HandleCloseForm()}
        src={closeForm}
        className="close-create-form"
      />
    </form>
  );
};

export default FormCreateCard;
