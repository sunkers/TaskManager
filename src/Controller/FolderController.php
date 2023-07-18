<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\HttpFoundation\Request;
use App\Service\FolderService;

class FolderController extends AbstractController
{
    /**
     * @Route("/getCurrentFolder", name="getCurrentFolder")
     */
    public function getCurrentFolder(SessionInterface $session, FolderService $folderService): Response
    {
        $currentFolderName = $session->get('currentFolder');
        $currentFolder = $folderService->getFolderByName($currentFolderName);

        // Transform the Folder object to an array and return it as JSON
        $folderArray = [
            'name' => $currentFolder->getName(),
            'description' => $currentFolder->getDescription(),
            // add any other fields from the Folder object that you need
        ];

        return new JsonResponse($folderArray);
    }

    /**
     * @Route("/changeFolder", name="changeFolder", methods={"POST"})
     */
    public function changeFolder(Request $request, SessionInterface $session, FolderService $folderService): Response
    {
        $folderName = $request->request->get('folderName');
        $session->set('currentFolder', $folderName);
        
        // Depending on your app's requirements, you may need to return a Response here.
        return new Response('Folder successfully changed', Response::HTTP_OK);
    }

}
