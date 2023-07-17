<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use App\Service\TaskService;
use App\Service\CollectionService;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

class TasksController extends AbstractController
{

    /**
     * @Route("/tasks", name="tasks", methods={"GET"})
     */
    public function tasks(TaskService $taskService, SessionInterface $session, CollectionService $collectionService): Response
    {
        $collection = $session->get('currentCollection');
        // $tasks = $taskService->getTasksForCollection($collection);
        $tasks = $taskService->getTasks();

        return $this->json($tasks);
    }

    /**
     * @Route("/add-task", name="add_task", methods={"POST"})
     */
    public function addTask(Request $request, TaskService $taskService): Response
    {
        $taskData = json_decode($request->getContent(), true);
        $taskService->saveTask($taskData);

        $tasks = $taskService->getTasks();
        return new JsonResponse($tasks);
    }
}
