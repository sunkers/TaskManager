<?php

namespace App\Entity;

use App\Repository\FolderRepository;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\MaxDepth;

#[ORM\Entity(repositoryClass: FolderRepository::class)]
class Folder
{
    #[ORM\Id, ORM\GeneratedValue, ORM\Column(type: "integer")]
    private ?int $id = null;

    #[ORM\Column(type: "string", length: 255)]
    private ?string $name = null;

    #[ORM\Column(type: "text", nullable: true)]
    private ?string $description = null;

    #[ORM\Column(type: "datetime")]
    private ?\DateTime $creationDate = null;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: "folders"), ORM\JoinColumn(nullable: false)]
    #[MaxDepth(1)]
    private $user;

    #[ORM\OneToMany(targetEntity: Task::class, mappedBy: "folder")]
    #[MaxDepth(1)]
    private $tasks;

    #[ORM\Column(type: "boolean", options: ["default" => 0])]
    private bool $by_default = false;

    public function __construct()
    {
        $this->tasks = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getCreationDate(): ?\DateTimeInterface
    {
        return $this->creationDate;
    }

    public function setCreationDate(\DateTimeInterface $creationDate): static
    {
        $this->creationDate = $creationDate;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getTasks()
    {
        return $this->tasks;
    }


    public function setTasks(?Task $tasks): static
    {
        $this->tasks = $tasks;

        return $this;
    }

    public function getByDefault(): ?bool
    {
        return $this->by_default;
    }

    public function setByDefault(bool $byDefault): static
    {
        $this->by_default = $byDefault;

        return $this;
    }
}
