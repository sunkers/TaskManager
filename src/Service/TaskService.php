<?php

namespace App\Service;

use App\Entity\Collection;
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
    private Security $security;
    private EntityManagerInterface $entityManager;
    private RequestStack $requestStack;

    public function __construct(
        TaskRepository $taskRepository, 
        Security $security,
        EntityManagerInterface $entityManager,
        RequestStack $requestStack,
    )
    {
        $this->taskRepository = $taskRepository;
        $this->security = $security;
        $this->entityManager = $entityManager;
        $this->requestStack = $requestStack;
    }

    public function getTasks(): array
    {
            $session = $this->requestStack->getSession();
            return $session->get('tasks', []);
    }

    public function getTasksForCollection(Collection $collection)
    {
        return $this->taskRepository->findBy(['collection' => $collection]);
    }

    public function saveTask(array $taskData): void
    {
            $session = $this->requestStack->getSession();
            $tasks = $session->get('tasks', []);
            $tasks[] = $taskData;
            $session->set('tasks', $tasks);

    }
}
