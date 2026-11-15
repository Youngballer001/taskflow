import DraggableTaskCard from './DraggableTaskCard';
export default function KanbanColumn({ id, title, tasks = [], onMove, savingTaskId }) {
  return <section className="panel kanban-column" aria-label={`${title}, ${tasks.length} tasks`} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); const taskId = Number(event.dataTransfer.getData('text/task-id')); if (taskId && tasks.every((task) => task.id !== taskId)) onMove(taskId, id); }}><header className="kanban-column-heading"><h3>{title}</h3><span>{tasks.length}</span></header><div className="kanban-column-body">{tasks.map((task) => <DraggableTaskCard key={task.id} task={task} disabled={savingTaskId === task.id} />)}{!tasks.length && <p className="kanban-empty">Drop tasks here</p>}</div></section>;
}
