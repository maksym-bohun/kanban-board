import { Board, Issue } from "../utils/models";
import { daysAgo } from "../helpers/helpers";

type ItemProps = {
  item: Issue;
  board: Board;
  dragOverHandler: (e: React.DragEvent<HTMLDivElement>) => void;
  dragLeaveHandler: (e: React.DragEvent<HTMLDivElement>) => void;
  dragStartHandler: (
    e: React.DragEvent<HTMLDivElement>,
    board: Board,
    item: Issue
  ) => void;
  dragEndHandler: (e: React.DragEvent<HTMLDivElement>) => void;
  dropHandler: (
    e: React.DragEvent<HTMLDivElement>,
    board: Board,
    item: Issue
  ) => void;
};

const Item: React.FC<ItemProps> = ({
  item,
  board,
  dragOverHandler,
  dragLeaveHandler,
  dragStartHandler,
  dragEndHandler,
  dropHandler,
}) => {
  console.log("item", item);
  const date = daysAgo(item["created_at"]);

  return (
    <div
      className="item"
      draggable={true}
      onDragOver={(e: React.DragEvent<HTMLDivElement>) => dragOverHandler(e)}
      onDragLeave={(e: React.DragEvent<HTMLDivElement>) => dragLeaveHandler(e)}
      onDragStart={(e: React.DragEvent<HTMLDivElement>) =>
        dragStartHandler(e, board, item)
      }
      onDragEnd={(e: React.DragEvent<HTMLDivElement>) => dragEndHandler(e)}
      onDrop={(e: React.DragEvent<HTMLDivElement>) =>
        dropHandler(e, board, item)
      }
    >
      <h5>{item.title}</h5>
      <p>
        #{item.number} opened {date}
      </p>
      <p>
        ${item.author} | Comments: {item.comments}
      </p>
    </div>
  );
};

export default Item;
