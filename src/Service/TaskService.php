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
            $session = $this->requestStack->getSession();
            return $session->get('tasks', []);
    }

    public function getTasksForFolder(Folder $folder)
    {
        return $this->taskRepository->findBy(['folder' => $folder]);
    }

    public function saveTask(array $taskData): void
    {
            $session = $this->requestStack->getSession();
            $tasks = $session->get('tasks', []);
            $tasks[] = $taskData;
            $session->set('tasks', $tasks);

    }
}
