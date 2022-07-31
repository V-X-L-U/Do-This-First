import { instance } from "../../instance";

const TaskListPage = () => {
  const createTask = async () => {
    const taskData = {
      name: "test task 1",
      description: "some desc",
      prereqs: [],
    };

    await instance
      .post("/api/tasks/create", taskData)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      This will the home page and where we see all our tasks.
      <button onClick={createTask}>Create</button>
    </div>
  );
};

export default TaskListPage;
