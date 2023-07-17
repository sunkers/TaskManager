<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\HttpFoundation\Request;

class CollectionsController extends AbstractController
{

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
