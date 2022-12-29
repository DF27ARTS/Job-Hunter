import { useEffect } from "react";
import { closeCardError, closeInputError } from "../store/cardSlice";
import { useAppDispatch } from "../store/store";
import { closeError } from "../store/userSlice";
import "../styles/ErrorMessage.scss";

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage = ({ message }: ErrorMessageProps) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    setTimeout(() => {
      dispatch(closeError());
      dispatch(closeCardError());
      dispatch(closeInputError());
    }, 4000);
  }, []);

  return (
    <div className="container-error shown">
      <p>{message}</p>
    </div>
  );
};

export default ErrorMessage;
