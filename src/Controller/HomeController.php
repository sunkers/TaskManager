<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Service\FolderService;
use App\Service\TaskService;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Security;

class HomeController extends AbstractController
{
    /**
     * @Route("/", name="home")
     */
    public function index(SessionInterface $session, FolderService $folderService, TaskService $taskService): Response
    {
        $is_logged = false;
        if ($this->getUser() !== null) {
            $is_logged = true;
            $folders = $folderService->getFolders();
            $defaultFolders = $folderService->getFoldersDefault();
            if($session->get('currentFolder') == null) $session->set('currentFolder', $defaultFolders[0]);
            $currentFolder = $session->get('currentFolder');
            $tasks = $taskService->getTasksForFolder($currentFolder);
        } else {
            $folders = '';
            $defaultFolders = '';
            $currentFolderName = '';
            $currentFolder = '';
            $tasks = '';
        }
        

        return $this->render('home/index.html.twig', [
            'controller_name' => 'HomeController',
            'currentFolder' => $currentFolder,
            'folders' => $folders,
            'defaultFolders' => $defaultFolders,
            'tasks' => $tasks,
            'is_logged' => $is_logged
        ]);
    }
}
