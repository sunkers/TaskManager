<?php

namespace App\Service;

use App\Entity\Collection;
use App\Entity\Task;
use App\Repository\TaskRepository;
use Doctrine\ORM\EntityManagerInterface;
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
        if ($this->security->getUser() !== null) {
            // L'utilisateur est connecté, récupérer les tâches de la base de données
            return $this->taskRepository->findAll();
        } else {
            $session = $this->requestStack->getSession();
            return $session->get('tasks', []);
            // return $this->session->get('tasks', []);
        }
    }

    public function getTasksForCollection(Collection $collection)
    {
        return $this->taskRepository->findBy(['collection' => $collection]);
    }

    public function saveTask(array $task): void
    {
        if ($this->security->getUser() !== null) {
            // L'utilisateur est connecté, sauvegarder la tâche en base de données
            $taskEntity = new Task();
            // Set all fields on the Task entity...
            $this->entityManager->persist($taskEntity);
            $this->entityManager->flush();
        } else {
            $session = $this->requestStack->getSession();
            $tasks = $session->get('tasks', []);
            $tasks[] = $task;
            $session->set('tasks', $tasks);
        }
    }
}
