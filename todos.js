const { supabase } = require('./supabase');
const { logger } = require('./winston_logger');

async function createTodo(id, userId, description, isCompleted) {
    const response = await supabase.from('todos').insert({
        id,
        user_id: userId,
        description,
        is_completed: isCompleted,
    }).select();

    const { updateError } = await supabase.from('logs').insert({ data: response });

    if (updateError) {
        logger.error('Error inserting log:', updateError);
    }

    const { data, error } = response;

    if (error) {
        logger.error(error);
        return null;
    }

    return data;
}

async function getTodoById(todoId) {
    const { data, error } = await supabase.from('todos').select('*').eq('id', todoId);

    if (error) {
        logger.error(error);
        return null;
    }

    return data[0];
}

async function updateTodo(todoId, title, description, isCompleted, updatedAt) {
    const response = await supabase.from('todos').update({
        id: todoId,
        title,
        description,
        is_completed: isCompleted,
        updated_at: updatedAt,
    }).eq('id', todoId).select();

    const { updateError } = await supabase.from('logs').insert({ data: response });

    if (updateError) {
        logger.error('Error inserting log:', updateError);
    }

    const { data, error } = response;

    if (error) {
        logger.error(error);
        return null;
    }

    return data;
}

async function deleteTodoById(todoId) {
    const { data, error } = await supabase.from('todos').delete().eq('id', todoId);

    if (error) {
        logger.error(error);
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
