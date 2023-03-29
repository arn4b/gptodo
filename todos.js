const supabase = require('./supabase');

async function createTodo(id, userId, description, isCompleted) {
    const { data, error } = await supabase.from('todos').insert({
        id,
        user_id: userId,
        description,
        is_completed: isCompleted,
    });

    if (error) {
        console.log(error);
        return null;
    }

    return data;
}

async function getTodoById(todoId) {
    const { data, error } = await supabase.from('todos').select('*').eq('id', todoId);

    if (error) {
        console.log(error);
        return null;
    }

    return data[0];
}

async function updateTodo(todoId, description, isCompleted) {
    const { data, error } = await supabase.from('todos').update({
        id: todoId,
        description,
        is_completed: isCompleted,
    }).eq('id', todoId);

    if (error) {
        console.log(error);
        return null;
    }

    console.log('Todos updated!');
    return data;
}

async function deleteTodoById(todoId) {
    const { data, error } = await supabase.from('todos').delete().eq('id', todoId);

    if (error) {
        console.log(error);
        return null;
    }

    return data;
}

module.exports = {
    createTodo,
    getTodoById,
    updateTodo,
    deleteTodoById,
};
