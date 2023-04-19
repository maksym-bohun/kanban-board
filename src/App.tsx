import React, { useState, useEffect } from "react";
import "./App.css";
import { Issue, Board } from "./utils/models";
import fetchData, { resetBoards } from "./helpers/helpers";
import Item from "./components/Item";
import InputField from "./components/InputField";
import Spinner from "./UI/Spinner";

function App() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [allIssues, setAllIssues] = useState<Issue[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [currentBoard, setCurrentBoard] = useState<Board>();
  const [currentIssue, setCurrentIssue] = useState<Issue>();
  const [hideIssues, setHideIssues] = useState(false);

  const submitHandler = async (url: string) => {
    if (url.trim().length > 0) {
      setIssues([]);
      setLoading(true);

      setHideIssues(true);
      fetchData(url)
        .then((res) => {
          setIssues(res);

          setError(false);
        })
        .catch(() => setError(true))
        .finally(() => {
          setLoading(false);
          setHideIssues(false);
        });
    }
  };

  useEffect(() => {
    if (isMounted && issues.length > 0) {
      boards[0].items = issues;
      setBoards((prevBoards) => [...prevBoards]);
      issues.forEach((issue) =>
        setAllIssues((currentIssues) => [...currentIssues, issue])
      );
    } else {
      setIsMounted(true);
      resetBoards(setBoards);
    }
  }, [issues]);

  const dragOverHandler = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const itemTarget = e.target as HTMLDivElement;
    if (itemTarget.className === "item") {
      itemTarget.style.boxShadow = "0 3px 3px rgba(0,0,0,0.5)";
    }
  };

  const dragLeaveHandler = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const itemTarget = e.target as HTMLDivElement;
    itemTarget.style.boxShadow = "none";
  };

  const dragStartHandler = (
    e: React.DragEvent<HTMLDivElement>,
    board: Board,
    item: Issue
  ) => {
    setCurrentBoard(board);
    setCurrentIssue(item);
  };

  const dragEndHandler = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const itemTarget = e.target as HTMLDivElement;
    itemTarget.style.boxShadow = "none";
  };

  const dropHandler = (
    e: React.DragEvent<HTMLDivElement>,
    board: Board,
    item: Issue
  ) => {
    e.stopPropagation();
    e.preventDefault();
    console.log("current issue", currentIssue);
    if (currentBoard && currentIssue) {
      const currentIndex = currentBoard.items.indexOf(currentIssue);
      currentBoard.items.splice(currentIndex, 1);
      const dropIndex = board.items.indexOf(item);
      board.items.splice(dropIndex + 1, 0, currentIssue);

      setBoards(
        boards.map((b) => {
          if (b.id === board.id) {
            return board;
          }
          if (b.id === currentBoard.id) {
            return currentBoard;
          }
          return b;
        })
      );
    } else return;
  };

  const dropToContainerHandler = (
    e: React.DragEvent<HTMLDivElement>,
    board: Board
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentBoard && currentIssue) {
      const currentIndex = currentBoard?.items.indexOf(currentIssue);
      currentBoard?.items.splice(currentIndex, 1);
      console.log("BOARD", board);
      board.items.unshift(currentIssue);
      setBoards(
        boards.map((b) => {
          if (b.id === board.id) {
            return board;
          }
          if (b.id === currentBoard.id) {
            return currentBoard;
          }
          return b;
        })
      );
    }
  };

  const dragOverContainerHandler = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="App">
      <InputField submitHandler={submitHandler} error={error} />

      <div className="boards-container">
        {boards.map((board) => {
          return (
            <div
              key={board.title}
              className="board"
              onDragOver={(e: React.DragEvent<HTMLDivElement>) =>
                dragOverContainerHandler(e)
              }
              onDrop={(e: React.DragEvent<HTMLDivElement>) =>
                dropToContainerHandler(e, board)
              }
            >
              <h3 className="board__title">{board.title}</h3>
              <div className="list">
                {allIssues.length === 0 && !loading && (
                  <p>No issues in this repo</p>
                )}
                {loading && (
                  <div className="spinner">
                    <Spinner />
                    <p>Please wait...</p>
                  </div>
                )}
                {error && !loading && <h2 className="error">Incorrect url!</h2>}
                {!hideIssues &&
                  board.items.map((item) => (
                    <Item
                      key={item.number}
                      item={item}
                      board={board}
                      dragOverHandler={dragOverHandler}
                      dragLeaveHandler={dragLeaveHandler}
                      dragStartHandler={dragStartHandler}
                      dragEndHandler={dragEndHandler}
                      dropHandler={dropHandler}
                    />
                  ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
