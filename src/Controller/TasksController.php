<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use App\Service\TaskService;
use App\Service\FolderService;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

class TasksController extends AbstractController
{

    /**
     * @Route("/tasks", name="tasks", methods={"GET"})
     */
    public function tasks(TaskService $taskService, SessionInterface $session, FolderService $folderService): Response
    {
        $folder = $session->get('currentFolder');
        $tasks = $taskService->getTasksForFolder($folder);
        // $tasks = $taskService->getTasks();

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

    /**
     * @Route("/getTasksForFolder/{folderName}", name="get_tasks_for_folder", methods={"GET"})
     */
    public function getTasksForFolder(string $folderName, FolderService $folderService, TaskService $taskService): Response
    {
        $folder = $folderService->getFolderByName($folderName);
        $tasks = $taskService->getTasksForFolder($folder);

        return $this->json($tasks);
    }

}
