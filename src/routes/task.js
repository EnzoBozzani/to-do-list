const express = require('express');

const checklistsDependentRoute = express.Router();
const simpleRouter = express.Router();

const Checklist = require('../models/checklist');
const Task = require('../models/task');

checklistsDependentRoute.get('/:id/tasks/new', async (req, res) => {
    try {
        let task = new Task();
        res.status(200).render('tasks/new', {checklistId: req.params.id, task: task });
    } catch (error){
        res.status(500).render('pages/error', {error: 'Erro ao carregar o formulário'});
    }
})

checklistsDependentRoute.post('/:id/tasks', async (req, res) => {
    let { name } = req.body.task;
    let task = new Task({ name, checklistId: req.params.id });
    try {
        await task.save();
        let checklist = await Checklist.findById(req.params.id);
        checklist.tasks.push(task);
        await checklist.save();
        res.redirect(`/checklists/${req.params.id}`);
    } catch (err) {
        let error = err.errors;
        res.status(422).render('tasks/new', {task: {...task, error}, checklistId: req.params.id});
    }
})

simpleRouter.delete('/:id', async (req, res) => {
    try {
        let task = await Task.findByIdAndDelete(req.params.id);
        let checklist = await Checklist.findById(task.checklistId);
        let taskPosition = checklist.tasks.indexOf(task._id);
        checklist.tasks.splice(taskPosition, 1);
        await checklist.save();
        res.redirect(`/checklists/${checklist._id}`);
    } catch (error) {
        res.status(422).render('pages/error', {error: 'Erro ao remover uma tarefa'});
    }
})


module.exports = { 
    checklistsDependent: checklistsDependentRoute, 
    simple: simpleRouter 
}