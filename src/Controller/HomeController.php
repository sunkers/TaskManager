<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Service\TaskService;
use App\Service\CollectionService;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Collection;

class HomeController extends AbstractController
{
    /**
     * @Route("/", name="home")
     */
    public function index(SessionInterface $session, CollectionService $collectionService): Response
    {
        if ($this->getUser() === null) {
            if ($session->get('currentCollection') === null) {
                $session->set('collections', ['My Day', 'Important', 'Work', 'Personal']);
                $collectionService->initCollection();
            }
        }

        $collection = $session->get('currentCollection');
        

        return $this->render('home/index.html.twig', [
            'controller_name' => 'HomeController',
            'collection' => $collection,
        ]);
    }

    /**
     * @Route("/tasks", name="tasks", methods={"GET"})
     */
    public function tasks(TaskService $taskService, SessionInterface $session, CollectionService $collectionService): Response
    {
        $collection = $session->get('currentCollection');
        $tasks = $taskService->getTasksForCollection($collection);

        return $this->json($tasks);
    }

    /**
     * @Route("/change-collection", name="change_collection", methods={"POST"})
     */
    public function changeCollection(Request $request, SessionInterface $session): Response
    {
        $collection = $request->request->get('collection');
        $session->set('currentCollection', $collection);

        return new Response();
    }
}
