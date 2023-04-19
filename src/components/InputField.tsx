import React, { useState, useEffect } from "react";
import "../App.css";
import icon from "./../icons/star.png";

interface InputFieldProps {
  submitHandler: (value: string) => void;
  error: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ submitHandler, error }) => {
  const [inputValue, setInputValue] = useState("");
  const [currentUrl, setCurrentUrl] = useState("");
  const [path, setPath] = useState<string[]>([]);
  const [showPath, setShowPath] = useState(false);
  const [stars, setStars] = useState(0);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputValue.trim().length > 0) {
      submitHandler(inputValue);
      await createPath();
      setShowPath(true);
      setInputValue("");
    }
  };

  useEffect(() => {
    if (error) setShowPath(false);
  }, [error]);

  const createPath = async () => {
    const parts = inputValue.split("/");
    const newParts = parts.map((part) => {
      if (inputValue.length > 0) setCurrentUrl(inputValue);
      if (part.length > 0) return part[0].toUpperCase() + part.slice(1);
      return "";
    });
    const result = newParts.slice(3);
    setPath(result);
    const res = await fetch(`https://api.github.com/repos/${result.join("/")}`);
    const repo = await res.json();
    setStars(repo["stargazers_count"]);
  };

  return (
    <div className="actions-container">
      <form className="input-field" onSubmit={handleSubmit}>
        <input
          type="text"
          onChange={handleChange}
          value={inputValue}
          placeholder="Enter repo url"
        />
        <button className="button">Load Issues</button>
      </form>
      {showPath && currentUrl && stars && (
        <div className="path-container">
          <a href={currentUrl} className="repo-path" target="_blank">
            {path.join(" > ")}
          </a>
          <span>
            <img src={icon} alt="star icon" className="star-icon" />
            {stars > 1000 ? stars.toString().slice(0, -3) + "K" : stars} stars
          </span>
        </div>
      )}
    </div>
  );
};

export default InputField;
