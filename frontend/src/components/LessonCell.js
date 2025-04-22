import { useDrag, useDrop } from "react-dnd";

function LessonCell( {day, hour, subject, onDrop, onHover, isSelected, teacher, setIsDragging} )
{
  const [{ isDragging }, drag] = useDrag(() =>
  ({
    type: "lesson",
    item: subject ? { day, hour, subject } : undefined,
    canDrag: !!subject,
    collect: (monitor) => ( {isDragging: monitor.isDragging()} ),
    end: () => { setIsDragging(false) }
  }), [subject]);

  const [, drop] = useDrop(() => ({
    accept: "lesson",
    drop: (draggedItem) => {
      if (draggedItem.day !== day || draggedItem.hour !== hour)
        onDrop(draggedItem, { day, hour });
    }
  }));

  const isCellSelected = isSelected && !isDragging;

  return (
    <td
      ref={(node) => drag(drop(node))}
      onMouseEnter={() => onHover(day, hour)}
      onMouseLeave={() => onHover(null, null)}
      style={{
        cursor: subject ? "move" : "default",
        opacity: isDragging ? 0.3 : 1,
        position: "relative",
        backgroundColor: isCellSelected ? "#fff3cd" : "transparent",
        transition: "background-color 0.2s ease"
      }}>

      {isCellSelected && teacher ?
      (<div className="teacher-overlay">{teacher}</div>) : (subject)}
    </td>
  );
}

export default LessonCell;