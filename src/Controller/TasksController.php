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
     * @Route("/task/new", name="add_task", methods={"POST"})
     */
    public function addTask(Request $request, SessionInterface $session, TaskService $taskService, SerializerService $serializerService): Response
    {
        $taskData = json_decode($request->getContent(), true);
        $currentFolder = $session->get('currentFolder');
        if ($currentFolder === null) {
            return new JsonResponse(['error' => 'Folder not found'], Response::HTTP_BAD_REQUEST);
        }
        
        if (!isset($taskData['taskName']) || !isset($taskData['taskDescription'])) {
            return new JsonResponse(['error' => 'Task data is incomplete'], Response::HTTP_BAD_REQUEST);
        }

        try {
            $taskService->saveTask($taskData, $currentFolder);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Failed to save task: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        $tasks = $taskService->getTasksForFolder($currentFolder);
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
