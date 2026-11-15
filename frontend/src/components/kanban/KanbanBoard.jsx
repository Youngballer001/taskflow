import KanbanColumn from './KanbanColumn';
const COLUMNS = [{ id: 'TODO', title: 'To do' }, { id: 'IN_PROGRESS', title: 'In progress' }, { id: 'IN_REVIEW', title: 'In review' }, { id: 'COMPLETED', title: 'Completed' }, { id: 'CANCELLED', title: 'Cancelled' }];
export default function KanbanBoard({ tasks = [], onMove, savingTaskId }) { return <div className="kanban-grid">{COLUMNS.map((column) => <KanbanColumn key={column.id} {...column} tasks={tasks.filter((task) => task.status === column.id)} onMove={onMove} savingTaskId={savingTaskId} />)}</div>; }
