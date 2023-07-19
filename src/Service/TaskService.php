<?php

namespace App\Service;

use App\Entity\Folder;
use App\Entity\User;
use App\Entity\Task;
use App\Repository\TaskRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Config\SecurityConfig;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpFoundation\RequestStack;

class TaskService
{
    private TaskRepository $taskRepository;
    private EntityManagerInterface $entityManager;
    private RequestStack $requestStack;

    public function __construct(
        TaskRepository $taskRepository, 
        EntityManagerInterface $entityManager,
        RequestStack $requestStack,
    )
    {
        $this->taskRepository = $taskRepository;
        $this->entityManager = $entityManager;
        $this->requestStack = $requestStack;
    }

    public function getTasks(): array
    {
        return $this->taskRepository->findAll();
    }

    public function getTasksForFolder(Folder $folder)
    {
        return $this->taskRepository->findBy(['folder' => $folder]);
    }

    public function saveTask(array $taskData, Folder $folder): void
    {
        $task = new Task();
        $task->setName($taskData['taskName']);
        $task->setDescription($taskData['taskDescription']);
        $task->setStatus(0);
        $task->setFolder($folder);
        
        $this->entityManager->persist($task);
        $this->entityManager->flush();
    }
}
