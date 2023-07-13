<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Service\CollectionService;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\HttpFoundation\Request;

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
}
