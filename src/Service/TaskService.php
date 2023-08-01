<?php

namespace App\Service;

use App\Entity\Folder;
use App\Entity\User;
use App\Entity\Task;
use App\Repository\TaskRepository;
use Doctrine\ORM\EntityManagerInterface;
use PhpParser\Node\Name;
use Symfony\Config\SecurityConfig;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

class TaskService
{
    private TaskRepository $taskRepository;
    private EntityManagerInterface $entityManager;
    private RequestStack $requestStack;
    private Security $security;

    public function __construct(
        TaskRepository $taskRepository, 
        EntityManagerInterface $entityManager,
        RequestStack $requestStack,
        Security $security,
    )
    {
        $this->taskRepository = $taskRepository;
        $this->entityManager = $entityManager;
        $this->requestStack = $requestStack;
        $this->security = $security;
    }

    public function getTasks(): array
    {
        return $this->taskRepository->findBy([], ['id' => 'ASC']);
    }

    public function getTasksForFolder(Folder $folder, $sortBy)
    {
        return $this->taskRepository->findBy(['folder' => $folder], [$sortBy => 'ASC']);
    }
    
    public function getImportantTasks($sortBy)
    {
        $user = $this->security->getUser();
        $folders = $this->entityManager->getRepository(Folder::class)->findBy(['user' => $user]);
        $data = [];
        foreach ($folders as $folder) {
            $tasks = $this->taskRepository->findBy(['importance' => '1', 'folder' => $folder], [$sortBy => 'ASC']);
            foreach ($tasks as $task) {
                $data[] = $task;
            }
        }
        return $data;
    }
    

    public function getTaskById(int $taskId): ?Task
    {
        return $this->taskRepository->find($taskId);
    }

    public function saveTask(array $taskData, Folder $folder): void
    {
        $folder = $this->entityManager->getRepository(Folder::class)->findOneById($folder->getId());
    
        $task = new Task();
        $task->setName($taskData['taskName']);
        $task->setDescription($taskData['taskDescription']);
        if (isset($taskData['goalDate'])) $task->setGoalDate(new \DateTime($taskData['goalDate']));
        $task->setLocation($taskData['location']);
        $task->setStatus(0);
        $task->setFolder($folder);
    
        $this->entityManager->persist($task);
        $this->entityManager->flush();
    }

    public function updateTask(int $taskId, array $taskData): void
    {
        $task = $this->taskRepository->find($taskId);
        if ($task !== null) {
            $task->setName($taskData['taskName']);
            $task->setDescription($taskData['taskDescription']);
            if (isset($taskData['goalDate'])) $task->setGoalDate(new \DateTime($taskData['goalDate']));
            $task->setLocation($taskData['location']);
            $this->entityManager->flush();
        }
    }
    

    public function updateTaskStatus(int $taskId, int $status): void
    {
        $task = $this->taskRepository->find($taskId);
        if ($task !== null) {
            $task->setStatus($status);
            $this->entityManager->flush();
        }
    }

    public function updateTaskImportance(int $taskId, int $importance): void
    {
        $task = $this->taskRepository->find($taskId);
        if ($task !== null) {
            $task->setImportance($importance);
            $this->entityManager->flush();
        }
    }

    public function deleteTask(int $taskId): void
    {
        $task = $this->taskRepository->find($taskId);
        if ($task !== null) {
            $this->entityManager->remove($task);
            $this->entityManager->flush();
        }
    }

    public function duplicateTask(int $taskId): void
    {
        $task = $this->taskRepository->find($taskId);
        if ($task !== null) {
            $newTask = new Task();
            $newTask->setName($task->getName());
            $newTask->setDescription($task->getDescription());
            $newTask->setGoalDate($task->getGoalDate());
            $newTask->setLocation($task->getLocation());
            $newTask->setStatus($task->getStatus());
            $newTask->setImportance($task->getImportance());
            $newTask->setFolder($task->getFolder());
            $this->entityManager->persist($newTask);
            $this->entityManager->flush();
        }
    }

    public function nl2br(string $text): string
    {
        return nl2br($text);
    }
}
