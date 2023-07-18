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
        $collections = $collectionService->getCollections();
        $defaultCollections = $collectionService->getCollectionsDefault();

        // Check if the user is connected
        $is_logged = false;
        if ($this->getUser() !== null) {
            $is_logged = true;
        }
        

        return $this->render('home/index.html.twig', [
            'controller_name' => 'HomeController',
            'collections' => $collections,
            'defaultCollections' => $defaultCollections,
            'is_logged' => $is_logged
        ]);
    }
}
