import TaskCard from './TaskCard';
import EmptyState from '../common/EmptyState';
export default function TaskList({ tasks = [] }) { return tasks.length ? <div className="task-list">{tasks.map((task) => <TaskCard key={task.id} task={task} />)}</div> : <EmptyState title="No tasks found" />; }
