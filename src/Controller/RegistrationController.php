<?php

namespace App\Controller;

use App\Entity\Collection;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use SebastianBergmann\Environment\Console;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authentication\UserAuthenticatorInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;
use App\Service\CollectionService;

class RegistrationController extends AbstractController
{
    private $authenticator;

    public function __construct(UserAuthenticatorInterface $authenticator)
    {
        $this->authenticator = $authenticator;
    }

    /**
     * @Route("/login", name="app_login", methods={"POST", "GET"})
     */
    public function login(AuthenticationUtils $authenticationUtils): Response
    {
        $error = $authenticationUtils->getLastAuthenticationError();
        $lastUsername = $authenticationUtils->getLastUsername();

        $this->addFlash('success', 'You are now connected');

        return new Response('User logged in successfully', Response::HTTP_OK);
    }

    /**
     * @Route("/register", name="app_register", methods={"POST"})
     */
    public function register(Request $request, UserPasswordHasherInterface $passwordHasher, EntityManagerInterface $entityManager, CollectionService $collectionService): Response
    {
        $email = $request->request->get('email');
        $password = $request->request->get('password');

        // check if email already exists
        $existingUser = $entityManager->getRepository(User::class)->findOneBy(['email' => $email]);
        if ($existingUser) {
            return new Response('Email already in use', Response::HTTP_CONFLICT);
        }

        // create a new user
        $user = new User();

        // encode the plain password
        $encodedPassword = $passwordHasher->hashPassword($user, $password);

        // set user properties
        $user->setEmail($email);
        $user->setPassword($encodedPassword);

        // save the user
        $entityManager->persist($user);
        $entityManager->flush();

        $this->addFlash('info', 'Your account has been created');

        
        $collectionService->initCollection($user);

        // Create 4 basic Collections at the creation of the user
        $collections = ['☀️ My Day' => 'A collection for your daily tasks', '⚠️ Important' => 'Keep your most important tasks here!', '💼 Work' => 'When it comes to work...', '🧑‍💼 Personal' => "Don't forget to pick up the kids!"];
        foreach ($collections as $collection => $description) {
            $newCollection = new Collection();
            $newCollection->setName($collection);
            $newCollection->setDescription($description);
            $newCollection->setCreationDate(new \DateTime());
            $newCollection->setUser($user);
            $entityManager->persist($newCollection);
            $entityManager->flush();
        }


        return new Response('User created successfully', Response::HTTP_CREATED);
    }


    /**
     * @Route("/logout", name="logout", methods={"GET"})
     */
    public function logout()
    {
        $this->addFlash('info', 'You have been disconnected');
    }
}
