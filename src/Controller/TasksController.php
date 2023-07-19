<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use App\Service\SerializerService;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use App\Service\TaskService;
use App\Service\FolderService;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Serializer\SerializerInterface;

class TasksController extends AbstractController
{

    /**
     * @Route("/tasks", name="tasks", methods={"GET"})
     */
    public function tasks(TaskService $taskService, SessionInterface $session, FolderService $folderService, SerializerService $serializerService): Response
    {
        $folder = $session->get('currentFolder');
        $tasks = $taskService->getTasksForFolder($folder);
        $jsonTasks = $serializerService->getSerializer()->serialize($tasks, 'json');
    
        return new Response($jsonTasks, 200, ['Content-Type' => 'application/json']);
    }

    /**
     * @Route("/add-task", name="add_task", methods={"POST"})
     */
    public function addTask(Request $request, TaskService $taskService, SerializerService $serializerService): Response
    {
        $taskData = json_decode($request->getContent(), true);
        $taskService->saveTask($taskData);

        $tasks = $taskService->getTasks();
        $jsonTasks = $serializerService->getSerializer()->serialize($tasks, 'json');
    
        return new Response($jsonTasks, 200, ['Content-Type' => 'application/json']);
    }

    /**
     * @Route("/getTasksForFolder/{folderName}", name="get_tasks_for_folder", methods={"GET"})
     */
    public function getTasksForFolder(string $folderName, FolderService $folderService, TaskService $taskService, SerializerService $serializerService): Response
    {
        $folder = $folderService->getFolderByName($folderName);
        $tasks = $taskService->getTasksForFolder($folder);

        $jsonTasks = $serializerService->getSerializer()->serialize($tasks, 'json');
    
        return new Response($jsonTasks, 200, ['Content-Type' => 'application/json']);
    }
}
