import React, { useState, useEffect } from "react";
import "./App.css";
import { Issue, Board } from "./utils/models";
import fetchData from "./helpers/helpers";
import Item from "./components/Item";
import Spinner from "./UI/Spinner";
import { resetBoards } from "./helpers/helpers";

function App() {
  const [url, setUrl] = useState("");
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [boards, setBoards] = useState<Board[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [currentBoard, setCurrentBoard] = useState<Board>();
  const [currentIssue, setCurrentIssue] = useState<Issue>();

  const submitHandler = async (e: any) => {
    e.preventDefault();
    resetBoards(setBoards);
    if (url.trim().length > 0) {
      setLoading(true);
      try {
        await fetchData(url, setIssues);
        setError(false);
      } catch (err) {
        console.log(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (isMounted) {
      boards[0].items = issues;
      setBoards((prevBoards) => [...prevBoards]);
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
    // e.dataTransfer.setData("text/plain", item.id.toString());
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
    console.log(e.target);
    console.log("CURRENT BOARD", currentBoard);
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
      <form className="input-field" onSubmit={submitHandler}>
        <input
          type="text"
          onChange={(e) => setUrl(e.target.value)}
          value={url}
        />
        <button className="button">Submit</button>
      </form>

      <div className="boards-container">
        {boards.map((board) => {
          return (
            <div
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
                {loading && (
                  <div className="spinner">
                    <Spinner />
                    <p>Please wait...</p>
                  </div>
                )}
                {error && <h2 className="error">Incorrect url!</h2>}
                {board.items.map((item) => (
                  <Item
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
