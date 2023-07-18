<?php

namespace App\Entity;

use App\Repository\TaskRepository;
use Doctrine\Common\Collections\ArrayCollection as ArrayCollectionAlias;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;


#[ORM\Entity(repositoryClass: TaskRepository::class)]
class Task
{
    #[ORM\Id, ORM\GeneratedValue, ORM\Column(type: "integer")]
    private ?int $id = null;

    #[ORM\Column(type: "string", length: 255)]
    private ?string $name = null;

    #[ORM\Column(type: "string", length: 255, nullable: true)]
    private ?string $description = null;

    #[ORM\Column(type: "integer", nullable: true)]
    private ?int $status = null;

    #[ORM\Column(type: "string", length: 255, nullable: true)]
    private ?string $color = null;

    #[ORM\Column(type: "smallint", nullable: true)]
    private ?int $importance = null;

    #[ORM\ManyToOne(targetEntity: Folder::class, inversedBy: "tasks"), ORM\JoinColumn(nullable: false)]
    private $folder;

    #[ORM\OneToMany(targetEntity: Label::class, mappedBy: "task")]
    private $labels;

    public function __construct()
    {
        $this->labels = new ArrayCollectionAlias();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): static
    {
        $this->id = $id;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): static
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

    public function getStatus(): ?int
    {
        return $this->status;
    }

    public function setStatus(?int $status): static
    {
        $this->status = $status;

        return $this;
    }

    public function getColor(): ?string
    {
        return $this->color;
    }

    public function setColor(?string $color): static
    {
        $this->color = $color;

        return $this;
    }

    public function getImportance(): ?int
    {
        return $this->importance;
    }

    public function setImportance(?int $importance): static
    {
        $this->importance = $importance;

        return $this;
    }

    public function getCollection(): ?Folder
    {
        return $this->folder;
    }
    
    public function setFolder(?Folder $folder): self
    {
        $this->folder = $folder;
    
        return $this;
    }
    
    /**
     * @return Collection
     */
    public function getLabels(): Collection
    {
        return $this->labels;
    }


    public function addLabel(Label $label): self
    {
        if (!$this->labels->contains($label)) {
            $this->labels[] = $label;
            $label->setTask($this);
        }

        return $this;
    }

    public function removeLabel(Label $label): self
    {
        if ($this->labels->removeElement($label)) {
            if ($label->getTask() === $this) {
                $label->setTask(null);
            }
        }

        return $this;
    }
}