<?php

namespace App\Service;

use App\Entity\Folder;
use App\Entity\User;
use App\Repository\FolderRepository;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpFoundation\RequestStack;
use Doctrine\ORM\EntityManagerInterface;

class FolderService
{
    private FolderRepository $folderRepository;
    private Security $security;
    private $requestStack;
    private EntityManagerInterface $entityManager;

    public function __construct(
        FolderRepository $folderRepository, 
        Security $security,
        RequestStack $requestStack,
        EntityManagerInterface $entityManager,
    ) 
    {
        $this->folderRepository = $folderRepository;
        $this->security = $security;
        $this->entityManager = $entityManager;
        $this->requestStack = $requestStack;
    }

    public function getFolders()
    {
        if ($this->security->getUser() !== null) {
            // L'utilisateur est connecté, récupérer la folder de la base de données
            $folders = $this->folderRepository->findBy(['by_default' => 'false']);
            if ($folders === null) {
                return null;
            }
            return $folders;
        } else {
            // L'utilisateur n'est pas connecté, récupérer la folder depuis la session

        }
    }

    public function getFoldersDefault()
    {
        if ($this->security->getUser() !== null) {
            // L'utilisateur est connecté, récupérer la folder de la base de données
            $folders = $this->folderRepository->findBy(['by_default' => 'true']);
                if ($folders === null) {
                return null;
            }
            return $folders;
        } else {
            // L'utilisateur n'est pas connecté, récupérer la folder depuis la session

        }
    }

    public function getFolderByName(string $name): Folder
    {
        if ($this->security->getUser() !== null) {
            // L'utilisateur est connecté, récupérer la folder de la base de données
            $folder = $this->folderRepository->findOneBy(['name' => $name]);
            if ($folder === null) {
                throw new \Exception("Folder not found");
            }
            return $folder;
        } else {
            // L'utilisateur n'est pas connecté, récupérer la folder depuis la session
            $session = $this->requestStack->getSession();
            $folders = $session->get('folders', []);
            foreach ($folders as $folder) {
                if ($folder['name'] == $name) {
                    return $folder;
                }
            }
            throw new \Exception("Folder not found");
        }
    }

    public function initFolder(User $user)
    {
        $entityManager = $this->entityManager;
        // Create 4 basic Folders at the creation of the user
        $folders = ['☀️ My Day' => 'A folder for your daily tasks', '⚠️ Important' => 'Keep your most important tasks here!', '💼 Work' => 'When it comes to work...', '🧑‍💼 Personal' => "Don't forget to pick up the kids!"];
        foreach ($folders as $folder => $description) {
            $newFolder = new Folder();
            $newFolder->setName($folder);
            $newFolder->setDescription($description);
            $newFolder->setCreationDate(new \DateTime());
            $newFolder->setUser($user);
            $newFolder->setByDefault(true);
            $entityManager->persist($newFolder);
            $entityManager->flush();
        }
    }

    public function createFolder(string $name, string $description)
    {
        $entityManager = $this->entityManager;
        $user = $this->security->getUser();
        $newFolder = new Folder();
        $newFolder->setName($name);
        $newFolder->setDescription($description);
        $newFolder->setCreationDate(new \DateTime());
        $newFolder->setUser($user);
        $newFolder->setByDefault(false);
        $entityManager->persist($newFolder);
        $entityManager->flush();
    }

    public function deleteFolder(int $id)
    {
        $entityManager = $this->entityManager;
        $folder = $this->folderRepository->findOneById($id);
    
        // If folder is by_default, we can't delete it
        if ($folder->getByDefault() == true) {
            throw new \Exception("You can't delete this folder");
        }
    
        $session = $this->requestStack->getSession();
        $currentFolder = $session->get('currentFolder');
        $user = $this->security->getUser();
    
        // If the folder to delete is the current collection, set a new current collection
        if ($folder->getName() === $currentFolder->getName()) {
            $defaultFolders = $this->folderRepository->findBy(['by_default' => true, 'user' => $user]);
            $session->set('currentFolder', $defaultFolders[0]);
        }
    
        $entityManager->remove($folder);
        $entityManager->flush();
    }
    
    public function getFolderById(int $id): Folder
    {
        $folder = $this->folderRepository->findOneById($id);
        if ($folder === null) {
            throw new \Exception("Folder not found");
        }
        return $folder;
    }
}
